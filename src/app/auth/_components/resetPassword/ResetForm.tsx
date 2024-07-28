// Byimaan
'use client';
import { ResetPasswordToken } from '@prisma/client';
import React from 'react'

type Props = {
  tokenDetails : ResetPasswordToken
}

function ResetForm({tokenDetails}: Props) {
  return (
    <div>ResetFom</div>
  )
}

export default ResetForm