import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Table.module.css';

export function TableContainer({ className, children, ...props }) {
  return (
    <div className={cn(styles.tableContainer, className)} {...props}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}

export function TableHead({ className, children, ...props }) {
  return <thead className={className} {...props}>{children}</thead>;
}

export function TableBody({ className, children, ...props }) {
  return <tbody className={className} {...props}>{children}</tbody>;
}

export function TableRow({ className, children, ...props }) {
  return <tr className={cn(styles.tr, className)} {...props}>{children}</tr>;
}

export function TableHeader({ className, children, ...props }) {
  return <th className={cn(styles.th, className)} {...props}>{children}</th>;
}

export function TableCell({ className, children, ...props }) {
  return <td className={cn(styles.td, className)} {...props}>{children}</td>;
}
