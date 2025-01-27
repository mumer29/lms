//importo el modelo de usuario
import User from '../models/user';
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
	// res.json('REGISTER USER RESPONSE FROM CONTROLLER');

	try {
		console.log(req.body);
		const { name, lastname, email, password } = req.body;
		//validacion
		if (!name) {
			return res.status(400).send(`NAME IS REQUIRED`);
		}
		if (!lastname) {
			return res.status(400).send(`LAST NAME IS REQUIRED`);
		}
		if (!password || password.length < 6) {
			return res
				.status(400)
				.send(
					`PASSWORD IS REQUIRED AND SHOULD BE MIN 6 CHARACTERS LONG`
				);
		}
		//valido que el usuario no exista por el email
		let userExist = await User.findOne({ email }).exec();
		if (userExist) {
			return res.status(400).send(`EMAIL IS TAKEN`);
		}

		//hasheo el password
		const hashedPassword = await hashPassword(password);

		//register
		const user = new User({
			name,
			lastname,
			email,
			password: hashedPassword,
		});

		//guardo el usuario
		await user.save();
		console.log(`SAVED USER: ${user}`);
		return res.status(200).json({ ok: true });
	} catch (err) {
		console.log(err);
		return res.status(400).send(`ERROR: ${err}`);
	}
};

export const login = async (req, res) => {
	try {
		// console.log(req.body);
		const { email, password } = req.body;
		//validacion

		if (!password || password.length < 6) {
			return res
				.status(400)
				.send(
					`PASSWORD IS REQUIRED AND SHOULD BE MIN 6 CHARACTERS LONG`
				);
		}
		//chequeo que exista el usuario
		let user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(400).send(`NO USER FOUND`);
		}
		//chequeo password
		const match = await comparePassword(password, user.password);

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});
		//return user and token to client, exclude hashed password
		user.password = undefined;
		// send token in cookie
		res.cookie('token', token, {
			httpOnly: true,
			// secure: true, //solo funciona en https
		});
		//send user as json response
		res.json(user);
	} catch (error) {
		return res.status(400).send('ERROR. TRY AGAIN.');
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie('token');
		return res.json({ message: 'SIGNOUT SUCCESS' });
	} catch (error) {
		console.log(error);
	}
};
