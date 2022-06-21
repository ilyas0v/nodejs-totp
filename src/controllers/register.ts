import * as speakeasy from 'speakeasy'
import * as bcrypt from 'bcryptjs'
import * as Validator from 'validatorjs'
import { Request, Response, NextFunction } from 'express'
import { urlToQRCode } from '../helpers'
import { Prisma } from '../Prisma'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const rules = {
        fullname: 'required',
        email: 'required|email',
        password: 'required|min:8',
    }

    const validation = new Validator(req.body, rules)

    if (validation.fails()) {
        return res.status(422).json(validation.errors)
    }

    const { fullname, email, password } = req.body

    const existingUser = await Prisma.user.findFirst({
        where: { email },
    })

    if (existingUser) {
        return res.status(422).json({ errors: { email: ['User with this email is already exist'] } })
    }

    const secret = speakeasy.generateSecret({
        name: email,
    })

    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = await Prisma.user.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
            secretBase32: secret.base32,
        },
    })

    urlToQRCode(secret.otpauth_url, (qrCode: string) => {
        return res.status(200).json({ qrCode })
    })
}
