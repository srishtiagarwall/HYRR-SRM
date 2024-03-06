import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

const Signup = () => {
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const [successMessage, setSuccessMessage] = useState('');

    const sendWelcomeEmail = async (email) => {
        // Simulate sending a welcome email
        console.log(`Welcome email sent to ${email}`);
    };

    const onSubmit = async (data) => {
        try {
            await sendWelcomeEmail(data.email);

            // Display success message
            setSuccessMessage('Signup successful! Welcome to MelodyVerse.');

            // Redirect to post list screen
            history.push('/posts');
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" ref={register({ required: true })} />
                    {errors.username && <p>Username is required.</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" ref={register({ required: true, pattern: /^\S+@\S+$/i })} />
                    {errors.email && <p>Enter a valid email address.</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" ref={register({ required: true })} />
                    {errors.password && <p>Password is required.</p>}
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" name="confirmPassword" ref={register({ required: true })} />
                    {errors.confirmPassword && <p>Confirm password is required.</p>}
                </div>
                <div>
                    <input type="checkbox" name="terms" ref={register({ required: true })} />
                    <label>I agree to the terms and conditions.</label>
                    {errors.terms && <p>You must agree to the terms and conditions.</p>}
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
};

export default Signup;