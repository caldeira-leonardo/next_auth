'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='position-relative overflow-hidden min-vh-100 w-100 d-flex align-items-center justify-content-center'>
        <div className='d-flex align-items-center justify-content-center w-100'>
          <div className='row justify-content-center w-100'>
            <div className='col-lg-6'>
              <div className='text-center d-flex flex-column justify-content-center align-items-center'>
                <Image
                  src='/modernize/assets/images/backgrounds/errorimg.svg'
                  alt='not-found-img'
                  width={500}
                  height={400}
                  className='img-fluid mb-4'
                />

                <h1 className='fw-semibold mb-7 fs-9 text-gray-800'>Oops!!!</h1>

                <h4 className='fw-semibold mb-7 text-gray-600'>
                  A página que você está procurando não existe ou não está disponível.
                </h4>

                <div className='bg-blue-50 border border-blue-200 rounded-md p-4 mb-6'>
                  <p className='text-sm text-blue-800 mb-0'>
                    Você será redirecionado automaticamente em alguns segundos.
                  </p>
                </div>

                <button
                  onClick={goBack}
                  className='btn btn-primary px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200'
                >
                  Voltar a página anterior
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
