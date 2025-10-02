import { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ChevronDown } from "lucide-react";

const SelectionOverLay = () => {
    const op = useRef<OverlayPanel>(null);

    return (
        <>
            <button onClick={(e) => op.current?.toggle(e)}>
                <ChevronDown className='text-black' />
            </button>
            <OverlayPanel ref={op}>
                <div className="flex gap-2 p-2">
                    <input 
                        type="number" 
                        className='border-zinc-400 border rounded px-2 py-1'
                        placeholder="Enter value"
                    />
                    <button 
                        type="button"
                        className="bg-zinc-800 hover:bg-zinc-950 text-white px-3 py-1 rounded"
                        onClick={() => {
                            console.log('Submit clicked');
                        }}
                    >
                        Submit
                    </button>
                </div>
            </OverlayPanel>
        </>
    )
}
export default SelectionOverLay