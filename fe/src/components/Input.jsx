
export default function Input({ name, value, placeholder = "", type = "text", fn, error }) {
    //error can be undefined, length>0, length=0.
    //undefined if no error is found, 0 for initial render, >0 if error present.
    
    const  BaseStyles = "w-full px-4 py-2 rounded-xl border border-zinc-600 bg-zinc-800 text-zinc-100  focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
    
    const BorderStyles = (error===undefined ? " outline-2 outline-green-500": (error.length===0 ? "" : " outline-2 outline-red-500"));

    const InpStyles = BaseStyles + BorderStyles
    
    const Name = name.charAt(0).toUpperCase() + name.slice(1);
    
    return (
        <div className="flex flex-col gap-2 items-start">
            <label htmlFor={name} className="text-[16px] font-medium text-white mb-1">{Name}:</label>
            <input
                className={InpStyles}
                type={type}
                name={name}
                id={name}
                value={value}
                placeholder={placeholder}
                onChange={fn} />
            {error && <span className="text-sm text-red-400">{error}</span>}
            {error===undefined && <span className="text-sm text-green-400">Looks good!</span>}
        </div>
    )
}