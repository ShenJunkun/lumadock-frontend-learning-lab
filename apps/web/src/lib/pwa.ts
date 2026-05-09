type ServiceWorkerContainerLike = {
  register: (scriptUrl: string) => Promise<unknown>;
};

type NavigatorLike = {
  serviceWorker?: ServiceWorkerContainerLike;
};

export type PwaRegistrationOptions = {
  isProduction: boolean;
  navigatorLike?: NavigatorLike;
  scriptUrl?: string;
};

export function shouldRegisterPwaServiceWorker(
  isProduction: boolean,
  navigatorLike: NavigatorLike = navigator,
) {
  return isProduction && Boolean(navigatorLike.serviceWorker);
}

export async function registerPwaServiceWorker({
  isProduction,
  navigatorLike = navigator,
  scriptUrl = "/sw.js",
}: PwaRegistrationOptions) {
  if (!shouldRegisterPwaServiceWorker(isProduction, navigatorLike)) {
    return false;
  }

  await navigatorLike.serviceWorker?.register(scriptUrl);
  return true;
}
