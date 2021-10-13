import React from "react";
import {useInView} from "react-intersection-observer";

export type InViewProps = {
  onIntersect: () => void
}

export const InView: React.FC<InViewProps> = (props) => {
  const {ref, inView} = useInView({
    threshold: 0
  })
  if (inView) {
    props.onIntersect()
  }
  return <div ref={ref}>&nbsp;</div>
}
