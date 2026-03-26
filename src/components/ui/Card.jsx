import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Card.module.css';

export function Card({ className, ...props }) {
  return <div className={cn(styles.card, className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn(styles.cardHeader, className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn(styles.cardTitle, className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn(styles.cardDescription, className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn(styles.cardContent, className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn(styles.cardFooter, className)} {...props} />;
}
