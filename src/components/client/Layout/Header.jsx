/* Libraries */
import { Link, useNavigate } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Assets */
import { images } from '@assets/images';

/* Components */
import { Container, DarkModeSwitcher } from '@components/shared';

export default function Header() {
    /* Hooks */
    const navigate = useNavigate();

    /* Event handlers */
    const handleGoBack = () => {
        if (window.history.length > 2) navigate(-1);
        else navigate('/');
    };

    return (
        <header className='sticky top-0 z-20 bg-white shadow-md dark:bg-black dark:text-white dark:outline dark:outline-1 dark:outline-gray-500'>
            <Container className='flex items-center justify-between gap-x-4 h-[3.75rem]'>
                <section className='lg:flex-1 flex items-center gap-x-2'>
                    <Link to='/'>
                        <img src={images.logo} alt='logo' className='w-10' />
                    </Link>
                    <button type='button' className='flex items-center hover:animate-float-left' onClick={handleGoBack}>
                        <Unicons.UilAngleLeft size='24' />
                        <span className='font-semibold text-sm'>Quay lại</span>
                    </button>
                </section>
                <DarkModeSwitcher />
            </Container>
        </header>
    );
}
