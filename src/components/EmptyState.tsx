import React from 'react';
import emptyIcon from '../../assets/icons8-empty-48.png';

interface EmptyStateProps {
  message?: string;
  description?: string;
  className?: string;
  iconClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Sem dados',
  description,
  className = '',
  iconClassName = 'w-16 h-16'
}) => (
  <div className={`flex flex-col items-center justify-center gap-3 text-center text-neutral-500 ${className}`}>
    <img src={emptyIcon} alt="Sem dados" className={iconClassName} />
    <div className="space-y-1 max-w-[26rem]">
      <p className="text-base font-semibold text-neutral-900">{message}</p>
      {description ? (
        <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
      ) : null}
    </div>
  </div>
);

export const isDataEmpty = (value: unknown) => {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};
