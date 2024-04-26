/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagePanorama, Viewer } from 'panolens';
import * as Unicons from '@iconscout/react-unicons';
import ScrollAnimation from 'react-animate-on-scroll';
import * as THREE from 'three';

/* Assets */
import { images } from '@assets/images';

/* Components */
import { ClientHomeHeader } from '@components/client';

export default function HeroSection() {
    /* States */
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    /* Refs */
    const viewerRef = useRef(null);
    const viewerElementRef = useRef(null);

    /* Side effects */
    /* Initialize Panorama Viewer */
    useEffect(() => {
        if (!isFirstLoad) return;
        setIsFirstLoad(false);

        viewerRef.current = new Viewer({
            container: viewerElementRef.current,
            cameraFov: 72,
            autoRotate: true,
            autoHideInfospot: false,
            autoRotateSpeed: 0.4,
            autoRotateActivationDuration: 1000,
            controlBar: false
        });
        const panorama = new ImagePanorama(images.homeScene);
        panorama.addEventListener('enter-fade-start', function() {
            viewerRef.current.tweenControlCenter(new THREE.Vector3(4911.907, -547.77344, 690.033), 0);
        }); // Set scene initial view position
        viewerRef.current.add(panorama);
    }, []);

    return (
        <section className='relative w-screen h-screen'>
            <div id='panorama' ref={viewerElementRef} className='w-full h-full'></div>
            <div className='absolute inset-0 bg-black/40 snap-center'>
                <section className='flex flex-col items-center justify-between gap-y-4 mx-auto px-6 h-full'>
                    <ClientHomeHeader />
                    <div className='flex flex-col gap-y-16 items-center mx-auto px-6'>
                        <div className='font-oswald flex flex-col gap-y-4 w-full text-center'>
                            <ScrollAnimation animateIn='fadeInUp' duration={0.8} offset={0} animateOnce>
                                <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide text-white uppercase'>
                                    Khám phá
                                </h2>
                            </ScrollAnimation>
                            <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={300} offset={0} animateOnce>
                                <h1 className='font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide text-white uppercase'>
                                    Trường Đại học Đà Lạt
                                </h1>
                            </ScrollAnimation>
                        </div>
                        <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={600} offset={0} animateOnce>
                            <Link
                                to='/tours/dalat-university'
                                className='flex items-center font-bold md:text-xl text-white uppercase animate-float-right'
                            >
                                <span>Bắt đầu</span>
                                <Unicons.UilAngleRight size='48' />
                            </Link>
                        </ScrollAnimation>
                    </div>
                    <div></div>
                </section>
            </div>
        </section>
    );
}
