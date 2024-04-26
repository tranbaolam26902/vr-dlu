/* Libraries */
import { useEffect } from 'react';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { HeroSection } from '@components/client';
import { PageTransition } from '@components/shared';

export default function Home() {
    /* Functions */
    const setPageTitle = () => {
        document.title = getSubPageTitle('Trang chủ');
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);

    return (
        <PageTransition className='overflow-x-hidden dark:bg-black dark:text-white'>
            <HeroSection />
        </PageTransition>
    );
}
