import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className ?: string;
}

function Container({ children, className }: ContainerProps) {
  return <div>{children}</div>;
}

export default Container;
