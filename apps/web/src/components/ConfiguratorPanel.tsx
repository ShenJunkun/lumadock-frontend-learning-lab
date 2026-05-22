import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, Check, GripVertical, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import {
  configuratorPriorityOptions,
  finishOptions,
  planOptions,
  standOptions,
  useConfiguratorStore,
  type ConfiguratorPriorityId,
  type FinishId,
  type PlanId,
  type StandId,
} from "../store/configuratorStore";

type ConfiguratorPanelProps = {
  basePrice?: number;
};

const priorityOptionById = new Map(
  configuratorPriorityOptions.map((option) => [option.id, option]),
);

type SortablePriorityItemProps = {
  isFirst: boolean;
  isLast: boolean;
  label: string;
  onMoveDown: () => void;
  onMoveUp: () => void;
  position: number;
  priorityId: ConfiguratorPriorityId;
  total: number;
  value: string;
};

function SortablePriorityItem({
  isFirst,
  isLast,
  label,
  onMoveDown,
  onMoveUp,
  position,
  priorityId,
  total,
  value,
}: SortablePriorityItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: priorityId });

  return (
    <li
      ref={setNodeRef}
      className={`priority-item${isDragging ? " is-dragging" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        ref={setActivatorNodeRef}
        className="priority-handle"
        type="button"
        aria-label={`Reorder ${label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} aria-hidden="true" />
      </button>
      <div className="priority-copy">
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
      <span className="priority-position" aria-label={`${label} position ${position} of ${total}`}>
        {position}
      </span>
      <div className="priority-actions">
        <button
          className="priority-icon-button"
          type="button"
          aria-label={`Move ${label} earlier`}
          disabled={isFirst}
          onClick={onMoveUp}
        >
          <ArrowUp size={15} aria-hidden="true" />
        </button>
        <button
          className="priority-icon-button"
          type="button"
          aria-label={`Move ${label} later`}
          disabled={isLast}
          onClick={onMoveDown}
        >
          <ArrowDown size={15} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export function ConfiguratorPanel({ basePrice = 289 }: ConfiguratorPanelProps) {
  const finish = useConfiguratorStore((state) => state.finish);
  const stand = useConfiguratorStore((state) => state.stand);
  const plan = useConfiguratorStore((state) => state.plan);
  const engraving = useConfiguratorStore((state) => state.engraving);
  const priorityOrder = useConfiguratorStore((state) => state.priorityOrder);
  const setFinish = useConfiguratorStore((state) => state.setFinish);
  const setStand = useConfiguratorStore((state) => state.setStand);
  const setPlan = useConfiguratorStore((state) => state.setPlan);
  const setEngraving = useConfiguratorStore((state) => state.setEngraving);
  const setPriorityOrder = useConfiguratorStore((state) => state.setPriorityOrder);
  const estimate = useConfiguratorStore((state) => state.estimate(basePrice));
  const [priorityStatus, setPriorityStatus] = useState("Configuration priority ready.");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const priorityValues = useMemo(
    () => ({
      engraving: engraving ? "Included" : "Standard",
      finish: finishOptions.find((option) => option.id === finish)?.label ?? finish,
      profile: planOptions.find((option) => option.id === plan)?.label ?? plan,
      stand: standOptions.find((option) => option.id === stand)?.label ?? stand,
    }),
    [engraving, finish, plan, stand],
  );

  const movePriority = (priorityId: ConfiguratorPriorityId, direction: -1 | 1) => {
    const currentIndex = priorityOrder.indexOf(priorityId);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= priorityOrder.length) {
      return;
    }

    const nextOrder = arrayMove(priorityOrder, currentIndex, nextIndex);
    setPriorityOrder(nextOrder);
    const option = priorityOptionById.get(priorityId);
    setPriorityStatus(`${option?.label ?? priorityId} moved to position ${nextIndex + 1}.`);
  };

  const handlePriorityDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = priorityOrder.indexOf(active.id as ConfiguratorPriorityId);
    const newIndex = priorityOrder.indexOf(over.id as ConfiguratorPriorityId);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const nextOrder = arrayMove(priorityOrder, oldIndex, newIndex);
    setPriorityOrder(nextOrder);
    const option = priorityOptionById.get(active.id as ConfiguratorPriorityId);
    setPriorityStatus(`${option?.label ?? active.id} moved to position ${newIndex + 1}.`);
  };

  return (
    <section className="configurator" aria-labelledby="configurator-title">
      <div className="configurator-heading">
        <span className="tool-icon" aria-hidden="true">
          <Sparkles size={18} />
        </span>
        <div>
          <span className="eyebrow">Configurator</span>
          <h2 id="configurator-title">Build a desk-ready setup</h2>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Finish</span>
        <div className="swatch-grid" role="group" aria-label="Finish">
          {finishOptions.map((option) => (
            <button
              key={option.id}
              className={`swatch-button${finish === option.id ? " is-selected" : ""}`}
              type="button"
              aria-pressed={finish === option.id}
              onClick={() => setFinish(option.id as FinishId)}
            >
              <span className="swatch" style={{ background: option.color }} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Stand</span>
        <div className="segmented-control" role="group" aria-label="Stand">
          {standOptions.map((option) => (
            <button
              key={option.id}
              className={stand === option.id ? "is-selected" : ""}
              type="button"
              aria-pressed={stand === option.id}
              onClick={() => setStand(option.id as StandId)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Profile</span>
        <div className="segmented-control" role="group" aria-label="Profile">
          {planOptions.map((option) => (
            <button
              key={option.id}
              className={plan === option.id ? "is-selected" : ""}
              type="button"
              aria-pressed={plan === option.id}
              onClick={() => setPlan(option.id as PlanId)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="toggle-row">
        <input
          checked={engraving}
          type="checkbox"
          onChange={(event) => setEngraving(event.target.checked)}
        />
        <span aria-hidden="true">
          <Check size={15} />
        </span>
        <strong>Personal engraving</strong>
      </label>

      <div className="control-group">
        <span className="control-label">Setup priority</span>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handlePriorityDragEnd}
        >
          <SortableContext items={priorityOrder} strategy={verticalListSortingStrategy}>
            <ol className="priority-list" aria-label="Configuration priority">
              {priorityOrder.map((priorityId, index) => {
                const option = priorityOptionById.get(priorityId);

                if (!option) {
                  return null;
                }

                return (
                  <SortablePriorityItem
                    key={priorityId}
                    isFirst={index === 0}
                    isLast={index === priorityOrder.length - 1}
                    label={option.label}
                    onMoveDown={() => movePriority(priorityId, 1)}
                    onMoveUp={() => movePriority(priorityId, -1)}
                    position={index + 1}
                    priorityId={priorityId}
                    total={priorityOrder.length}
                    value={priorityValues[priorityId]}
                  />
                );
              })}
            </ol>
          </SortableContext>
        </DndContext>
        <span className="visually-hidden" aria-live="polite">
          {priorityStatus}
        </span>
      </div>

      <div className="estimate-row" aria-live="polite">
        <span>Estimated setup</span>
        <strong>${estimate}</strong>
      </div>
    </section>
  );
}
