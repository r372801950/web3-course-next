import {ConnectButton} from "@rainbow-me/rainbowkit";

type ConnectBtnProps = {
  label: string;
}

const ConnectBtn = (props: ConnectBtnProps) => {
  return (
    <ConnectButton label={props.label} />
  )
}
export default ConnectBtn;