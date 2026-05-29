import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200/60 dark:bg-slate-800/40 ${className || ""}`}
            style={{
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear'
            }}
            {...props}
        />
    );
}
