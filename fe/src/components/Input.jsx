import { InpStyles,LabelStyles,DivStyles } from "../utils/InpStyles";

export default function Input({ name, value, placeholder="", type = "text" , fn}) {
    
    const Name = name.charAt(0).toUpperCase() + name.slice(1);

    return (
        <div className={DivStyles}>
            <label htmlFor={name} className={LabelStyles}>{Name}:</label>
            <input className={InpStyles} type={type} name={name} id={name} value={value} placeholder={placeholder} onChange={fn}/>
        </div>
    )
}