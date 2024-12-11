import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return <div className="w-full max-w-7xl mx-auto">{children}</div>;
}

export default Container;
