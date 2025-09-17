// Mock users para demonstração
const mockUsers = [
  {
    id: '1',
    name: 'João Admin',
    email: 'admin@empresa.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Maria Gestora',
    email: 'gestor@empresa.com',
    password: 'gestor123',
    role: 'gestor',
  },
  {
    id: '3',
    name: 'Pedro Usuário',
    email: 'usuario@empresa.com',
    password: 'usuario123',
    role: 'usuario',
  },
];

// Armazenamento temporário de códigos de verificação (em produção seria no backend)
const verificationCodes = new Map();

export async function sendVerificationCode(email) {
  // Simula delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find((u) => u.email === email);
  console.log('user', user);
  if (!user) {
    throw new Error('Email não encontrado');
  }

  // Gera código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Armazena código com expiração de 5 minutos
  verificationCodes.set(email, {
    code,
    expires: Date.now() + 5 * 60 * 1000,
    userId: user.id,
  });

  // Em produção, enviaria por email/SMS
  console.log(`[DEMO] Código de verificação para ${email}: ${code}`);

  return { success: true, message: 'Código enviado com sucesso' };
}

export async function verifyCodeAndLogin(email, code) {
  // Simula delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const storedData = verificationCodes.get(email);

  if (!storedData) {
    throw new Error('Código não encontrado ou expirado');
  }

  if (Date.now() > storedData.expires) {
    verificationCodes.delete(email);
    throw new Error('Código expirado');
  }

  if (storedData.code !== code) {
    throw new Error('Código inválido');
  }

  // Remove código usado
  verificationCodes.delete(email);

  // Busca usuário
  const user = mockUsers.find((u) => u.id === storedData.userId);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Gera tokens
  const tokens = generateTokens(user);
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    ...tokens,
  };
}

function generateTokens(user) {
  const now = Date.now();

  // Access token (2 horas)
  const accessToken = btoa(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
      iat: now,
      exp: now + 2 * 60 * 60 * 1000, // 2 horas
    })
  );

  // Refresh token (7 dias)
  const refreshToken = btoa(
    JSON.stringify({
      userId: user.id,
      type: 'refresh',
      iat: now,
      exp: now + 7 * 24 * 60 * 60 * 1000, // 7 dias
    })
  );

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken) {
  try {
    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const decoded = JSON.parse(atob(refreshToken));

    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido');
    }

    if (Date.now() > decoded.exp) {
      throw new Error('Refresh token expirado');
    }

    // Busca usuário
    const user = mockUsers.find((u) => u.id === decoded.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Gera novo access token
    const now = Date.now();
    const newAccessToken = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
        iat: now,
        exp: now + 2 * 60 * 60 * 1000, // 2 horas
      })
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error('Falha ao renovar token');
  }
}

export function validateAccessToken(accessToken) {
  try {
    const decoded = JSON.parse(atob(accessToken));

    if (decoded.type !== 'access') {
      return { valid: false, reason: 'Token inválido' };
    }

    if (Date.now() > decoded.exp) {
      return { valid: false, reason: 'Token expirado' };
    }

    return {
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (error) {
    return { valid: false, reason: 'Token malformado' };
  }
}
