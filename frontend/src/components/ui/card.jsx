import React from 'react';

const cardStyles = {
  card: "bg-[var(--card)] text-[var(--card-foreground)] flex flex-col gap-6 rounded-xl border border-[var(--border)]",
  header: "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6",
  title: "leading-none font-medium text-xl",
  description: "text-[var(--muted-foreground)] text-sm",
  content: "px-6",
  footer: "flex items-center px-6 pb-6",
};

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`${cardStyles.card} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`${cardStyles.header} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h4 className={`${cardStyles.title} ${className}`} {...props}>
      {children}
    </h4>
  );
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p className={`${cardStyles.description} ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`${cardStyles.content} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={`${cardStyles.footer} ${className}`} {...props}>
      {children}
    </div>
  );
}
