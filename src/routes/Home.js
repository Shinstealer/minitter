import React, { useState } from "react";

const Home = () => {
    const [minit, setMinit] = useState("");
    const onSubmit = (e) => {
        e.preventDefault();
        
    }
    const onChange = (e) => {
        const { target: { value } } = e;
        setMinit(value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>

                <input value={minit}
                    onChange={onChange}
                    type="text"
                    name="email"
                    placeholder="What is on your mind"
                    maxLength={120}
                />

                <input type="submit" value="MInit" />

            </form>

        </div>
    );
}
export default Home;