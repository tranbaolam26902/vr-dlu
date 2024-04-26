/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Parser } from 'html-to-react';
import * as uuid from 'uuid';

/* Redux */
import { selectLearning } from '@redux/features/client/learning';

/* Services */
import { getSlideById } from '@services/shared';

/* Utils */
import { getFileType } from '@utils/files';
import { extractFileName } from '@utils/strings';

export default function Content() {
    /* States */
    const learningSlice = useSelector(selectLearning);
    const [slide, setSlide] = useState({});

    /* Refs */
    const containerRef = useRef(null);
    const textRef = useRef(null);

    /* Functions */
    const getSlide = async () => {
        const slideResult = await getSlideById(learningSlice.currentSlideId);

        if (slideResult.isSuccess) setSlide(slideResult.result);
        else setSlide({});
    };

    /* Side effects */
    /* Get slide by id and reset scroll position */
    useEffect(() => {
        if (learningSlice.currentSlideId === uuid.NIL) return;

        getSlide();
        containerRef.current.scrollTo(0, 0);
        textRef.current.scrollTo(0, 0);
    }, [learningSlice.currentSlideId]);

    return (
        <main
            ref={containerRef}
            className={`overflow-y-auto xl:overflow-y-hidden absolute z-0 top-0 left-0 bottom-0 right-0 xl:grid xl:grid-cols-3 flex flex-col ${learningSlice.isShowSidebar ? 'xl:right-96' : ''
                } transition-all duration-300`}
        >
            {/* Start: Left section */}
            <section
                className={`relative ${slide.layout === 'full'
                        ? 'xl:col-span-2'
                        : slide.layout === 'media'
                            ? 'xl:col-span-3 h-full'
                            : slide.layout === 'text'
                                ? 'hidden'
                                : ''
                    } bg-dark`}
            >
                {slide.urlPath ? (
                    getFileType(extractFileName(slide.urlPath).extension) === 'image' ? (
                        <div className='relative flex items-center justify-center w-full h-full'>
                            <img
                                src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                alt={slide.title}
                                className='xl:absolute max-w-full max-h-full object-contain'
                            />
                        </div>
                    ) : getFileType(extractFileName(slide.urlPath).extension) === 'video' ? (
                        <video controls className='w-full h-full'>
                            <source src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`} type='video/mp4' />
                        </video>
                    ) : getFileType(extractFileName(slide.urlPath).extension) === 'audio' ? (
                        <audio controls className='xl:absolute xl:bottom-0 my-4 px-6 w-full'>
                            <source src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`} type='audio/mp3' />
                        </audio>
                    ) : null
                ) : null}
            </section>
            {/* End: Left section */}

            {/* Start: Right section */}
            <section
                ref={textRef}
                className={`${slide.layout === 'full'
                        ? 'xl:col-span-1'
                        : slide.layout === 'media'
                            ? 'hidden'
                            : slide.layout === 'text'
                                ? 'overflow-y-auto xl:col-span-3 h-full'
                                : ''
                    } xl:overflow-y-auto p-6`}
            >
                <div className='relative my-4 xl:mt-0'>
                    <div className='absolute z-10 -top-3 -left-3 flex items-center justify-center px-3 py-2 h-12 aspect-square font-bold text-2xl text-white bg-gradient-to-br from-white via-blue-300 to-blue-300 rounded-full'>
                        {slide.index}
                    </div>
                    <h1 className='pl-10 pr-8 py-2 font-bold text-2xl border border-gray-200 rounded-2xl drop-shadow-md shadow-inner'>
                        {slide.title}
                    </h1>
                </div>
                <div className='max-w-full dark:text-white prose dark:prose-heading:text-white dark:prose-lead:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-h4:text-white dark:prose-p:text-white dark:prose-a:text-white dark:prose-blockquote:text-white dark:prose-figure:text-white dark:prose-figcaption:text-white dark:prose-strong:text-white dark:prose-em:text-white dark:prose-code:text-white dark:prose-pre:text-white dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white dark:prose-table:text-white dark:prose-thead:text-white dark:prose-tr:text-white dark:prose-th:text-white dark:prose-td:text-white'>
                    {Parser().parse(slide.content)}
                </div>
            </section>
        </main>
    );
}
