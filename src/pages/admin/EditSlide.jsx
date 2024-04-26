/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import * as Unicons from '@iconscout/react-unicons';
import * as uuid from 'uuid';

/* Redux */
import {
    disableMultiSelectModeButton,
    enableFileManagementModal,
    selectFileManagement,
    setSelectFileCallback
} from '@redux/features/admin/fileManagement';
import { setSlides, showInfoHotspotDetailModal } from '@redux/features/client/tour';

/* Services */
import { useCourseServices, useLessonServices, useSlideServices } from '@services/admin';

/* Components */
import { Input } from '@components/admin';
import { Container, SlideDetailModal } from '@components/shared';
import { getSubPageTitle } from '~/utils/metadata';

export default function EditSlide() {
    /* Hooks */
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    /* Services */
    const courseServices = useCourseServices();
    const lessonServices = useLessonServices();
    const slideServices = useSlideServices();

    /* States */
    const fileManagement = useSelector(selectFileManagement);
    const [errorMessages, setErrorMessages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState(uuid.NIL);
    const [courseIdMessage, setCourseIdMessage] = useState('');
    const [lessons, setLessons] = useState([]);
    const [lessonId, setLessonId] = useState(uuid.NIL);
    const [lessonIdMessage, setLessonIdMessage] = useState('');
    const [slide, setSlide] = useState(null);
    const [index, setIndex] = useState('');
    const [title, setTitle] = useState('');
    const [titleMessage, setTitleMessage] = useState('');
    const [content, setContent] = useState('');
    const [contentMessage, setContentMessage] = useState('');
    const [layout, setLayout] = useState('full');
    const [isChangedMedia, setIsChangedMedia] = useState(false);
    const [media, setMedia] = useState({ thumbnailPath: '', urlPath: '' });
    const [mediaMessage, setMediaMessage] = useState('');
    const [hasChanged, setHasChanged] = useState(false);

    /* Refs */
    const indexRef = useRef(null);
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    /* Functions */
    const getAllCourses = async () => {
        const coursesResult = await courseServices.getAllCourses();

        if (coursesResult.isSuccess) setCourses(coursesResult.result);
        else setCourses([]);
    };
    const getLessons = async (id) => {
        if (id === uuid.NIL) return;

        const lessonsResult = await lessonServices.getLessonsByCourseId(id);

        if (lessonsResult.isSuccess) setLessons(lessonsResult.result);
        else setLessons([]);
    };
    const getSlide = async (id) => {
        const slideResult = await slideServices.getSlideById(id);

        if (slideResult.isSuccess) setSlide(slideResult.result);
        else navigate('/404');
    };
    const validateSlide = () => {
        let valid = true;

        if (!slide && courseId === uuid.NIL) {
            setCourseIdMessage('Chủ đề không được để trống.');
            valid = false;
        }
        if (!slide && lessonId === uuid.NIL) {
            setLessonIdMessage('Điểm thông tin không được để trống.');
            valid = false;
        }
        if (title.trim() === '') {
            setTitleMessage('Tên không được để trống.');
            valid = false;
        }
        if (layout !== 'media' && contentRef.current.getContent().trim() === '') {
            setContentMessage('Nội dung không được để trống.');
            valid = false;
        }
        if (layout !== 'text' && !media.path) {
            setMediaMessage('Media không được để trống.');
            valid = false;
        }

        return valid;
    };
    const setPageTitle = () => {
        if (id) document.title = getSubPageTitle('Chỉnh sửa nội dung');
        else document.title = getSubPageTitle('Thêm nội dung');
    };

    /* Event handlers */
    const handleSelectCourse = (e) => {
        setCourseId(e.target.value);
        if (e.target.value === uuid.NIL) {
            setCourseIdMessage('Vui lòng chọn chủ đề.');
            setLessons([]);
        } else setCourseIdMessage('');
    };
    const handleSelectLesson = (e) => {
        setLessonId(e.target.value);
        if (e.target.value === uuid.NIL) setLessonIdMessage('Vui lòng chọn điểm thông tin.');
        else setLessonIdMessage('');
    };
    const handleSelectLayout = (e) => {
        setLayout(e.target.value);
    };
    const handleSelectFile = () => {
        dispatch(
            setSelectFileCallback(() => {
                setIsChangedMedia(true);
            })
        );
        dispatch(disableMultiSelectModeButton());
        dispatch(enableFileManagementModal(true));
    };
    const handleDeleteMedia = () => {
        setMedia({ thumbnailPath: '', path: '' });
        setHasChanged(true);
    };
    const handleViewContent = () => {
        const editingSlide = {
            title: title.trim(),
            content: contentRef.current.getContent(),
            index,
            thumbnailPath: media.thumbnailPath,
            urlPath: media.path,
            layout
        };

        dispatch(setSlides([editingSlide]));
        dispatch(showInfoHotspotDetailModal());
    };
    const handleGoBack = () => {
        if (hasChanged) if (!confirm('Chưa lưu thay đổi. Xác nhận trở về?')) return;
        navigate(-1);
    };
    const handleSaveSlide = async (e) => {
        e.preventDefault();
        if (!validateSlide()) return;

        const newSlide = {
            title: title.trim(),
            content: layout !== 'media' ? contentRef.current.getContent() : title.trim(),
            urlPath: media.path,
            thumbnailPath: media.thumbnailPath,
            layout: document.querySelector('input[name="layout"]:checked').value
        };
        if (Number.parseInt(index) > 0) newSlide.index = Number.parseInt(index);

        if (slide) {
            // Edit slide
            const saveResult = await slideServices.updateSlide({ ...newSlide, id: slide.id });

            if (saveResult.isSuccess) {
                toast.success('Lưu thành công.');
                setErrorMessages([]);
                setHasChanged(false);
            } else setErrorMessages(saveResult.errors);
        } else {
            // Add new slide
            const saveResult = await slideServices.addSlideToLesson(newSlide, lessonId);

            if (saveResult.isSuccess) {
                toast.success('Thêm mới thành công.');
                navigate('/admin/slides', { state: { courseId, lessonId } });
                setHasChanged(false);
            } else setErrorMessages(saveResult.errors);
        }
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        if (!slide) getAllCourses();
        setPageTitle();
    }, []);
    /* Get selected course lessons */
    useEffect(() => {
        getLessons(courseId);
    }, [courseId]);
    /* Handle select file */
    useEffect(() => {
        if (!isChangedMedia) return;
        const selectedFile = fileManagement.selectedResult[0];
        if (!selectedFile) return;

        setMedia(selectedFile);
        setIsChangedMedia(false);
        setHasChanged(true);
    }, [isChangedMedia]);
    /* Get slide for editing */
    useEffect(() => {
        if (id) getSlide(id);
        if (!location.state) return;

        setCourseId(location.state.courseId);
        setLessonId(location.state.lessonId);
    }, [id]);
    /* Set slide value to controls */
    useEffect(() => {
        if (!slide) return;

        setIndex(slide.index);
        setTitle(slide.title);
        setContent(slide.content);
        setMedia({ path: slide.urlPath, thumbnailPath: slide.thumbnailPath });
        setLayout(slide.layout);
        document.querySelector(`input[name=layout][value=${slide.layout}]`).checked = true;
    }, [slide]);

    return (
        <section className='min-h-[calc(100vh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-y-4 py-4'>
                {
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold text-2xl'>{id ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}</h1>
                        <button
                            type='button'
                            className='flex items-center gap-x-1 font-semibold text-sm hover:opacity-80'
                            onClick={handleViewContent}
                        >
                            <Unicons.UilEye size='24' />
                            <span>Xem trước</span>
                        </button>
                    </div>
                }

                <form className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4' onSubmit={handleSaveSlide}>
                    {/* Start: Left section */}
                    <section className='flex flex-col gap-y-4'>
                        {errorMessages.map((errorMessage) => (
                            <h6 key={errorMessage} className='text-center text-lg text-red-400 italic'>
                                {errorMessage}
                            </h6>
                        ))}
                        {/* Start: Selects section */}
                        {!slide && (
                            <>
                                <div className='flex flex-col gap-y-2'>
                                    <span className='font-semibold'>Chọn chủ đề</span>
                                    <select
                                        className={`px-4 py-2 w-full h-full bg-white border ${courseIdMessage ? 'border-red-400' : 'border-gray-400'
                                            } rounded shadow-inner appearance-none dark:bg-dark`}
                                        onChange={handleSelectCourse}
                                        value={courseId}
                                    >
                                        <option value={uuid.NIL}>-- Chọn chủ đề --</option>
                                        {courses.map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                    {courseIdMessage && (
                                        <span className='italic text-sm text-red-400'>{courseIdMessage}</span>
                                    )}
                                </div>
                                <div className='flex flex-col gap-y-2'>
                                    <span className='font-semibold'>Chọn điểm thông tin</span>
                                    <select
                                        disabled={courseId === uuid.NIL}
                                        className={`px-4 py-2 w-full h-full bg-white border ${lessonIdMessage ? 'border-red-400' : 'border-gray-400'
                                            } rounded shadow-inner appearance-none dark:bg-dark`}
                                        onChange={handleSelectLesson}
                                        value={lessonId}
                                    >
                                        <option value={uuid.NIL}>-- Chọn điểm thông tin --</option>
                                        {lessons.map((lesson) => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.title}
                                            </option>
                                        ))}
                                    </select>
                                    {lessonIdMessage && (
                                        <span className='italic text-sm text-red-400'>{lessonIdMessage}</span>
                                    )}
                                </div>
                            </>
                        )}
                        {/* End: Selects section */}

                        {/* Start: Input section */}
                        <Input
                            ref={titleRef}
                            id='title'
                            label='Tên'
                            placeholder='Nhập tên nội dung...'
                            required
                            value={title}
                            message={titleMessage}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setTitleMessage('');
                                setHasChanged(true);
                            }}
                            clearInput={() => {
                                setTitle('');
                                setHasChanged(true);
                            }}
                        />
                        {/* End: Input section */}

                        {/* Start: Select layout section */}
                        <section className='flex flex-col gap-y-1'>
                            <span className='font-semibold'>Bố cục</span>
                            <div className='flex items-center gap-x-4'>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            type='radio'
                                            id='layout-1'
                                            name='layout'
                                            value='full'
                                            defaultChecked
                                            className='cursor-pointer'
                                            onChange={handleSelectLayout}
                                        />
                                        <label htmlFor='layout-1' className='cursor-pointer'>
                                            Đầy đủ
                                        </label>
                                    </div>
                                    <label htmlFor='layout-1' className='cursor-pointer'>
                                        <Unicons.UilWebSection size='48' />
                                    </label>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            type='radio'
                                            id='layout-2'
                                            name='layout'
                                            value='media'
                                            className='cursor-pointer'
                                            onChange={handleSelectLayout}
                                        />
                                        <label htmlFor='layout-2' className='cursor-pointer'>
                                            Media
                                        </label>
                                    </div>
                                    <label htmlFor='layout-2' className='cursor-pointer'>
                                        <Unicons.UilPanoramaHAlt size='48' />
                                    </label>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center gap-x-1'>
                                        <input
                                            type='radio'
                                            id='layout-3'
                                            name='layout'
                                            value='text'
                                            className='cursor-pointer'
                                            onChange={handleSelectLayout}
                                        />
                                        <label htmlFor='layout-3' className='cursor-pointer'>
                                            Văn bản
                                        </label>
                                    </div>
                                    <label htmlFor='layout-3' className='cursor-pointer'>
                                        <Unicons.UilDocumentLayoutLeft size='48' />
                                    </label>
                                </div>
                            </div>
                        </section>
                        {/* End: Select layout section */}

                        {/* Start: Select media section */}
                        <section className='flex flex-col gap-y-2'>
                            <div className='flex items-center justify-between'>
                                <label htmlFor='media' className='cursor-pointer w-fit font-semibold'>
                                    Media
                                </label>
                                {media.path && (
                                    <button
                                        type='button'
                                        className='font-semibold text-red-400 text-sm'
                                        onClick={handleDeleteMedia}
                                    >
                                        Xóa media
                                    </button>
                                )}
                            </div>
                            {media.path ? (
                                <div className='relative rounded overflow-hidden'>
                                    <img
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${media.thumbnailPath}`}
                                        alt='media'
                                        className='w-full'
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-0 flex items-center justify-center font-semibold text-xl text-white bg-gray-950 bg-opacity-60 opacity-0 hover:opacity-100'
                                        onClick={handleSelectFile}
                                    >
                                        Đổi media
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        id='media'
                                        type='button'
                                        className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed ${mediaMessage ? 'border-red-400' : 'border-gray-600 dark:border-white'
                                            } rounded-lg transition-transform duration-200 hover:opacity-80 shadow-inner`}
                                        onClick={handleSelectFile}
                                    >
                                        <Unicons.UilImage size='128' />
                                        <span className='font-semibold text-xl'>Chọn media</span>
                                    </button>
                                    {mediaMessage && (
                                        <span className='italic text-sm text-red-400'>{mediaMessage}</span>
                                    )}
                                </>
                            )}
                        </section>
                        {/* End: Select media section */}
                    </section>
                    {/* End: Left section */}

                    {/* Start: Right section */}
                    <section className='flex flex-col gap-y-1.5'>
                        {layout !== 'media' && (
                            <>
                                <label className='w-fit font-semibold cursor-pointer'>Nội dung</label>
                                {contentMessage && (
                                    <span className='italic text-sm text-red-400'>{contentMessage}</span>
                                )}
                                <Editor
                                    onInit={(_, editor) => (contentRef.current = editor)}
                                    apiKey='iy151ilgnsokvtpsb8eroaey31cdbzndda9k1s71o3hwlli9'
                                    init={{
                                        plugins:
                                            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount fullscreen',
                                        toolbar:
                                            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | fullscreen',
                                        toolbar_mode: 'wrap',
                                        min_height: 592,
                                        height: '100%',
                                        max_height: 792
                                    }}
                                    initialValue={content}
                                    onChange={() => {
                                        setContentMessage('');
                                    }}
                                />
                            </>
                        )}
                    </section>
                    {/* End: Right section */}

                    {/* Start: Buttons section */}
                    <div className='flex items-center justify-end gap-x-4'>
                        <button
                            type='button'
                            className='px-4 py-2 font-semibold hover:opacity-80'
                            onClick={handleGoBack}
                        >
                            Trở về
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 min-w-[6rem] font-semibold text-white bg-nature-green rounded hover:opacity-80'
                            onClick={handleSaveSlide}
                        >
                            Lưu
                        </button>
                    </div>
                    {/* End: Buttons section */}
                </form>
            </Container>
            <SlideDetailModal />
        </section>
    );
}
