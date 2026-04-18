import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = "" }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
};

export default Loader;
