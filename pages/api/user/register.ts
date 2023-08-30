import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data =
    | { message: string }
    | {
        token: string,
        user: {
            name: string,
            email: string,
            role: string
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            return res.status(400).json({ message: 'Method Not Allowed' })
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = "", password = "" , name = "" } = req.body as {email:string,password:string,name:string}

    if(password.length < 6){
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    if(name.length < 2){
        return res.status(400).json({ message: 'El Nombre debe tener al menos 2 caracteres' })
    }

    //TODO: VALIDAR EMAIL!!!

    if(!validations.isValidEmail(email)){
        return res.status(400).json({ message: 'El Correo no es valido' })
    }

    await db.connect()

    const user = await User.findOne({ email });

    if (user) {
        await db.disconnect()
        return res.status(400).json({ message: 'Ese Correo ya esta registrado!' })
    }

    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    });

    try {
        await newUser.save({validateBeforeSave:true})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Revisar logs' })
    }


    const { _id, role } = newUser

    const token = jwt.signToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            name,
            email,
            role
        }
    })
}
