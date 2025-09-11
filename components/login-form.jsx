"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";

export function LoginForm() {
  const [step, setStep] = useState(1); // 1 = email, 2 = código
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { sendCode, verifyCode, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("[v0] Step atual:", step);
  }, [step]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setSuccessMessage("");

    console.log("[v0] Tentando enviar código para:", email);

    try {
      const success = await sendCode(email);
      console.log("[v0] Resultado do sendCode:", success);

      if (success) {
        console.log("[v0] Antes de setStep(2), step atual:", step);
        setStep(2);
        setSuccessMessage("Código enviado para seu email!");
        console.log("[v0] Depois de setStep(2)");
      } else {
        setError("Email não encontrado");
        console.log("[v0] SendCode retornou false");
      }
    } catch (error) {
      console.error("[v0] Erro no handleSendCode:", error);
      setError("Erro ao enviar código");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Digite o código completo de 6 dígitos");
      return;
    }

    const success = await verifyCode(email, fullCode);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Código inválido ou expirado");
    }
  };

  const handleCodeChange = (index, value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Foca no próximo input se digitou um número
      if (numericValue && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length === 6) {
      const newCode = pastedData.split("").slice(0, 6);
      setCode(newCode);

      // Foca no último input
      const lastInput = document.getElementById("code-5");
      lastInput?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleBackToEmail = () => {
    // setStep(1)
    setCode(["", "", "", "", "", ""]);
    setError("");
    setSuccessMessage("");
  };

  console.log("[v0] Renderizando LoginForm com step:", step);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{step === 1 ? "Login" : "Verificação"}</CardTitle>
          <CardDescription>
            {step === 1
              ? "Digite seu email para receber o código de verificação"
              : "Digite o código de 6 dígitos enviado para seu email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-xs text-gray-500">Debug: Step = {step}</div>

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Código"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label>Código de Verificação</Label>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onPaste={(e) => handlePaste(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      autoComplete="off"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Código enviado para: {email}
                </p>
              </div>

              {successMessage && (
                <Alert>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Verificar Código"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Emails de teste:</p>
              <div className="text-xs space-y-1">
                <p>
                  <strong>Admin:</strong> admin@empresa.com
                </p>
                <p>
                  <strong>Gestor:</strong> gestor@empresa.com
                </p>
                <p>
                  <strong>Usuário:</strong> usuario@empresa.com
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
