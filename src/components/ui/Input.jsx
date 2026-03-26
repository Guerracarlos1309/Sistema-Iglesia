import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './Input.module.css';

const Input = forwardRef(({ className, label, icon: Icon, error, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cn(styles.formGroup, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon size={18} />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            styles.input,
            Icon && styles.hasIcon,
            error && styles.hasError
          )}
          {...props}
        />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
