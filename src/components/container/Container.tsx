import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children,className }: ContainerProps) {
  return <div className="w-full mx-auto">{children}</div>;
}

export default Container;
