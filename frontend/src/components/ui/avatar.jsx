import * as React from "react"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

const Avatar = ({ src, className, fallbackClass }) => (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary", className)}>
        {src ? (
            <img src={src} alt="avatar" className="aspect-square h-full w-full object-cover" />
        ) : (
            <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground", fallbackClass)}>
                <User className="h-2/3 w-2/3" />
            </div>
        )}
    </div>
)

export { Avatar }
