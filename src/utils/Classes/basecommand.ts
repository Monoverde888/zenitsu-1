import detritus from 'detritus-client';

class Base implements detritus.CommandClientAdd {
  _class?: any;
  _file?: string;
  args?: detritus.Command.ArgumentOptions[];
  disableDm?: boolean;
  disableDmReply?: boolean;
  metadata?: Record<string, any>;
  name: string;
  permissions?: (number | bigint)[];
  permissionsClient?: (number | bigint)[];
  permissionsIgnoreClientOwner?: boolean;
  priority?: number;
  ratelimit?: boolean | detritus.Command.CommandRatelimitOptions;
  ratelimits?: detritus.Command.CommandRatelimitOptions[];
  responseOptional?: boolean;
  triggerTypingAfter?: number;
  onDmBlocked?: detritus.Command.CommandCallbackDmBlocked;
  onBefore?: detritus.Command.CommandCallbackBefore;
  onBeforeRun?: detritus.Command.CommandCallbackBeforeRun;
  onCancel?: detritus.Command.CommandCallbackCancel;
  onCancelRun?: detritus.Command.CommandCallbackCancelRun;
  onError?: detritus.Command.CommandCallbackError;
  onPermissionsFail?: detritus.Command.CommandCallbackPermissionsFail;
  onPermissionsFailClient?: detritus.Command.CommandCallbackPermissionsFail;
  onRatelimit?: detritus.Command.CommandCallbackRatelimit;
  run?: detritus.Command.CommandCallbackRun;
  onRunError?: detritus.Command.CommandCallbackRunError;
  onSuccess?: detritus.Command.CommandCallbackSuccess;
  onTypeError?: detritus.Command.CommandCallbackTypeError;
  aliases?: string[];
  choices?: any[];
  consume?: boolean;
  default?: any;
  help?: string;
  label?: string;
  prefix?: string;
  prefixes?: string[];
  prefixSpace?: boolean;
  required?: boolean;
  type?: detritus.Command.ArgumentType;
}

export default Base;
