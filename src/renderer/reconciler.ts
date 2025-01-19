import ReactReconciler from 'react-reconciler';
import { TerraformNode } from './types';

type Type = string;
type Props = any;
type Container = { children: TerraformNode[] };
type Instance = TerraformNode;
type TextInstance = null;
type SuspenseInstance = never;
type HydratableInstance = never;
type PublicInstance = any;
type HostContext = any;
type UpdatePayload = any;
type ChildSet = any;
type TimeoutHandle = number;
type NoTimeout = number;

const hostConfig: ReactReconciler.HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
> = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  createInstance(type: Type, props: Props): Instance {
    return {
      type,
      props,
      children: []
    };
  },

  createTextInstance(): TextInstance {
    return null;
  },

  appendInitialChild(parentInstance: Instance, child: Instance) {
    if (!parentInstance.children) {
      parentInstance.children = [];
    }
    parentInstance.children.push(child);
  },

  appendChild(parentInstance: Instance, child: Instance) {
    if (!parentInstance.children) {
      parentInstance.children = [];
    }
    parentInstance.children.push(child);
  },

  appendChildToContainer(container: Container, child: Instance) {
    if (!container.children) {
      container.children = [];
    }
    container.children.push(child);
  },

  removeChild(parentInstance: Instance, child: Instance) {
    if (!parentInstance.children) {
      parentInstance.children = [];
      return;
    }
    const index = parentInstance.children.indexOf(child);
    if (index !== -1) {
      parentInstance.children.splice(index, 1);
    }
  },

  insertBefore(parentInstance: Instance, child: Instance, beforeChild: Instance) {
    if (!parentInstance.children) {
      parentInstance.children = [];
    }
    const index = parentInstance.children.indexOf(beforeChild);
    if (index !== -1) {
      parentInstance.children.splice(index, 0, child);
    }
  },

  prepareUpdate() {
    return null;
  },

  commitUpdate() {},

  commitTextUpdate() {},

  finalizeInitialChildren() {
    return false;
  },

  getPublicInstance(instance: any) {
    return instance;
  },

  prepareForCommit() {
    return null;
  },

  resetAfterCommit() {},

  shouldSetTextContent() {
    return false;
  },

  getRootHostContext() {
    return {};
  },

  getChildHostContext(parentHostContext: any) {
    return parentHostContext;
  },

  clearContainer(container: Container) {
    container.children = [];
  },

  preparePortalMount() {},

  scheduleTimeout(fn: (...args: unknown[]) => unknown, delay?: number) {
    return setTimeout(fn, delay) as unknown as number;
  },

  cancelTimeout(id: TimeoutHandle) {
    clearTimeout(id as unknown as NodeJS.Timeout);
  },

  noTimeout: -1,
  isPrimaryRenderer: true,
  getCurrentEventPriority: () => 99,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => {},
};

export const reconciler = ReactReconciler(hostConfig);
