import { cn } from "@/lib/utils";

interface EditableTextProps {
    contentKey: string;
    initialValue: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    className?: string;
}

export function EditableText({
    initialValue,
    as: Component = 'p',
    className,
}: EditableTextProps) {
    return (
        <Component className={cn(className)}>
            {initialValue}
        </Component>
    );
}
