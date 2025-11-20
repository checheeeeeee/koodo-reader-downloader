export interface LoginProps {
  handleLoadingDialog: (isShowLoading: boolean) => void;
  handleSetting: (isShow: boolean) => void;
  handleSettingMode: (settingMode: string) => void;
  handleSettingDrive: (settingDrive: string) => void;
  handleFetchAuthed: () => void;
  handleFetchDataSourceList: () => void;
  handleFetchDefaultSyncOption: () => void;
  handleFetchUserInfo: () => Promise<void>;
  t: (title: string) => string;
  isSettingOpen: boolean;
  isShowLoading: boolean;
  isShowSupport: boolean;
  history: any;
}

export interface LoginState {
  currentStep: number;
  loginConfig: any;
  isSendingCode: boolean;
  countdown: number;
  serverRegion: string;
}
