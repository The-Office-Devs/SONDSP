import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound, UserPlus } from 'lucide-react';

import type { Ui } from '@/components/HookForm/types';
import { TextField } from '@/components/HookForm/fields/TextField';
import { InputGroupField } from '@/components/HookForm/fields/InputGroupField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/lib/utils';

import { loginSchema, type LoginFormData } from '../login.schema';
import { useLogin } from '../use-login';
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  submitClassName?: string;
  showRemember?: boolean;
  linksStyle?: Ui;
};

function renderLinks(style: Ui, handleForgotPassword: () => void, handleActivateAccount: () => void) {
  if (style === 'mobile') {
    return (
      <div className="mt-6 text-center space-y-3">
        <button onClick={handleActivateAccount} type="button" className="flex w-full items-center justify-center gap-2 text-sm text-secondary hover:underline">
          <UserPlus size={16} />
          Primeiro acesso
        </button>
        <button onClick={handleForgotPassword} type="button" className="flex w-full items-center justify-center gap-2 text-sm text-secondary hover:underline">
          <KeyRound size={16} />
          Esqueci minha senha
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center space-y-2">
      <button onClick={handleActivateAccount} type="button" className="block w-full cursor-pointer text-sm text-secondary hover:underline">
        Primeiro acesso / Ativar conta
      </button>
      <button onClick={handleForgotPassword} type="button" className="block w-full cursor-pointer text-sm text-secondary hover:underline">
        Esqueci minha senha
      </button>
    </div>
  );
}

export function LoginForm({
  submitClassName,
  showRemember = false,
  linksStyle = 'desktop',
}: Readonly<LoginFormProps>) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error } = useLogin();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: ""
    }
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  const handleForgotPassword = () => {
    navigate('/esqueci-senha');
  }

  const handleActivateAccount = () => {
    navigate('/ativar-conta');
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          E-mail ou senha inválidos.
        </div>
      )}

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <TextField
            name="login"
            label="E-mail institucional"
            type="email"
            placeholder="nome@sondsp.gov.br"
            ui={linksStyle}
          />

          <InputGroupField
            name="password"
            label="Senha"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            suffix={{
              type: 'button',
              label: showPassword ? <EyeOff size={20} /> : <Eye size={20} />,
              onClick: () => setShowPassword((value) => !value),
            }}
            ui={linksStyle}
          />

          {showRemember && (
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                Manter-me conectado
              </Label>
            </div>
          )}

          <Button
            type="submit"
            variant="secondary"
            className={cn('w-full', submitClassName)}
            disabled={isPending}
          >
            {isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </FormProvider>

      {renderLinks(linksStyle, handleForgotPassword, handleActivateAccount)}
    </>
  );
}
