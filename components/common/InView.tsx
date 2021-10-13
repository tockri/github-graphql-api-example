import React, {useEffect} from "react";
import {useInView} from "react-intersection-observer";

export type InViewProps = {
  readonly onIntersect: () => void
}

export const InView: React.FC<InViewProps> = (props) => {
  const {ref, inView} = useInView({
    threshold: 0
  })
  useEffect(() => {
    if (inView) {
      props.onIntersect()
    }
  }, [inView, props])
  return <div ref={ref}>&nbsp;</div>
}
