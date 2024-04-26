/* Libraries */
import { Link } from 'react-router-dom';

/* Components */
import { DarkModeSwitcher } from '@components/shared';

export default function Header() {
    return (
        <header className='w-full'>
            <nav className='flex items-center justify-between gap-x-4 py-4 w-full text-white'>
                <div className='flex-1'>
                    <Link to='/' className='font-bold font-serif text-3xl md:text-4xl'>
                        DLU
                    </Link>
                </div>
                <DarkModeSwitcher />
            </nav>
        </header>
    );
}
