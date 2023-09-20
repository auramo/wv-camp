import React from 'react';

export function LoginForm () {
    return (<form className="pure-form pure-form-stacked">
            <fieldset>
                <legend>A Stacked Form</legend>
                <label htmlFor="stacked-email">Email</label>
                <input type="email" id="stacked-email" placeholder="Email" />
                <span className="pure-form-message">This is a required field.</span>
                <label htmlFor="stacked-password">Password</label>
                <input type="password" id="stacked-password" placeholder="Password" />
                <label htmlFor="stacked-state">State</label>
                <select id="stacked-state">
                    <option>AL</option>
                    <option>CA</option>
                    <option>IL</option>
                </select>
                <label htmlFor="stacked-remember" className="pure-checkbox">
                    <input type="checkbox" id="stacked-remember" /> Remember me
                </label>
                <button type="submit" className="pure-button pure-button-primary">Sign in</button>
            </fieldset>
        </form>
    )
}
