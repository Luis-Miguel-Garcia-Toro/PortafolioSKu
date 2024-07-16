import { useMemo } from 'react';
// styles
import '../../Styles/Skeleton.scss';

export enum SkeletonType {
  text = 'text',
  circle = 'circle',
  default = '',
}

interface SkeletonProps {
  width?: number;
  variant?: SkeletonType;
  height?: number;
}

export const Skeleton = ({
  width,
  height,
  variant = SkeletonType.default,
}: SkeletonProps) => {
  const setHeight = useMemo(() => {
    if (variant === SkeletonType.text) return 16;
    if (variant === SkeletonType.circle) return width;
    return height;
  }, [variant, height]);

  return (
    <div
      data-testid='skeleton'
      className={`a-skeleton ${variant}`}
      style={{ maxWidth: width, height: setHeight }}
    />
  );
};

export default Skeleton;