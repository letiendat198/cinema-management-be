const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    };

    const userResponse= user.toObject();
    delete userResponse.password;

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: userResponse
    });
}

export default sendToken;