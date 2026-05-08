import { Check, Sparkles } from "lucide-react";

import {
  finishOptions,
  planOptions,
  standOptions,
  useConfiguratorStore,
  type FinishId,
  type PlanId,
  type StandId,
} from "../store/configuratorStore";

type ConfiguratorPanelProps = {
  basePrice?: number;
};

export function ConfiguratorPanel({ basePrice = 289 }: ConfiguratorPanelProps) {
  const finish = useConfiguratorStore((state) => state.finish);
  const stand = useConfiguratorStore((state) => state.stand);
  const plan = useConfiguratorStore((state) => state.plan);
  const engraving = useConfiguratorStore((state) => state.engraving);
  const setFinish = useConfiguratorStore((state) => state.setFinish);
  const setStand = useConfiguratorStore((state) => state.setStand);
  const setPlan = useConfiguratorStore((state) => state.setPlan);
  const setEngraving = useConfiguratorStore((state) => state.setEngraving);
  const estimate = useConfiguratorStore((state) => state.estimate(basePrice));

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

      <div className="estimate-row" aria-live="polite">
        <span>Estimated setup</span>
        <strong>${estimate}</strong>
      </div>
    </section>
  );
}
