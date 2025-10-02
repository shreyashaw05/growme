import { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ChevronDown } from "lucide-react";

const SelectionOverLay = (props: { selectionLength: number, setSelectionLength: (length: number) => void }) => {
    const op = useRef<OverlayPanel>(null);

    const [value, setValue] = useState<number|''>('');
    return (
        <>
            <button onClick={(e) => op.current?.toggle(e)}>
                <ChevronDown className='text-black' />
            </button>
            <OverlayPanel ref={op}>
                <div className="flex gap-2 p-2">
                    <input 
                        type="number" 
                        value={value}
                        className='border-zinc-400 border rounded px-2 py-1'
                        placeholder="Enter value"
                        onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                    <button 
                        type="button"
                        className="bg-zinc-800 hover:bg-zinc-950 text-white px-3 py-1 rounded"
                        onClick={() => {
                            props.setSelectionLength(value as number);
                            op.current?.hide();
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