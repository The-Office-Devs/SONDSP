import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import type { Ui } from "../../components/HookForm/types";
import { InputGroupField } from "../../components/HookForm/fields/InputGroupField";

type Requirement = {
  label: string;
  test: (value: string) => boolean;
}

const requirements: Requirement[] = [
  {
    label: 'Pelo menos 8 caracteres',
    test: (v) => v.length >= 8
  },
  {
    label: '1 número',
    test: (v) => /[0-9]/.test(v)
  },
  {
    label: '1 letra maiúscula e 1 letra minúscula',
    test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v)
  },
];

interface NewPasswordFieldsProps {
  ui?: Ui;
}

export function NewPasswordFields({ ui = "desktop" }: NewPasswordFieldsProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const { control } = useFormContext();
  const password = useWatch({
    control,
    name: "newPassword",
    defaultValue: "",
  });

  const pendingRequirements = requirements.filter((req) => !req.test(password));

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <InputGroupField
          name="newPassword"
          label="Nova Senha"
          placeholder="••••••••"
          type={showNewPassword ? "text" : "password"}
          suffix={{
            type: "button",
            label: showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />,
            onClick: () => setShowNewPassword((value) => !value),
          }}
          ui={ui}
        />

        {!!password && pendingRequirements.length > 0 && (
          <ul>
            {pendingRequirements.map((req) => (
              <li key={req.label} className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-red-700" />
                <span className="text-red-700">{req.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <InputGroupField
        name="confirmNewPassword"
        label="Confirme a nova senha"
        placeholder="••••••••"
        type={showConfirmNewPassword ? "text" : "password"}
        suffix={{
          type: "button",
          label: showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />,
          onClick: () => setShowConfirmNewPassword((value) => !value),
        }}
        ui={ui}
      />
    </div>
  );
}