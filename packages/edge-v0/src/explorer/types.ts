export interface ExplorerProps {
  sessionId?: string;
  gameId?: string;
  baseUrl?: string;
  iconSize?: number;
  iconColor?: string;
  customIcon?: React.ReactNode;
  position?:
    | { top: string; left?: string; right?: never; bottom?: never }
    | { bottom: string; left?: string; right?: never; top?: never }
    | { left: string; top?: string; bottom?: never; right?: never }
    | { right: string; top?: string; bottom?: never; left?: never }
    | string;
  buttonStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  iframeStyle?: React.CSSProperties;
  iframeAttributes?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  onOpen?: () => void;
  onClose?: () => void;
  onIframeError?: (error: string) => void;
  errorStyle?: React.CSSProperties;
  children?: React.ReactNode;
}