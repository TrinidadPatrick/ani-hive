import { Calendar, ExternalLink, Heart } from 'lucide-react'

const TopSection = ({personInfo}) => {
    const bday = new Date(personInfo?.birthday).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className='flex flex-col sm:flex-row gap-7  w-full'>
            {/* image container */}
            <div className='overflow-hidden rounded-lg flex flex-none relative'>
                <img src={personInfo?.images?.jpg?.image_url} alt={personInfo?.name} className='z-20 w-40 object-cover object-center rounded-lg sm:hidden border border-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                <img src={personInfo?.images?.jpg?.image_url} alt={personInfo?.name} className='w-full aspect-square xs:aspect-video object-cover brightness-40 sm:brightness-100 blur-xs sm:blur-none sm:aspect-[2/3] sm:w-45' />
            </div>
            
            {/* Person Information */}
            <article className='w-full flex flex-col'>
                <h1 className='text-gray-200 text-3xl sm:text-4xl md:text-5xl font-bold'>{personInfo?.name}</h1>
                <h2 className='text-gray-200 text-base sm:text-lg md:text-xl font-normal mt-2'>{personInfo?.family_name}, {personInfo?.given_name}</h2>

                {/* nicknames */}
                {
                    personInfo?.alternate_names.length > 0 &&
                    (
                    <div className='flex gap-3 mt-4'>
                        {
                            personInfo?.alternate_names.map((nickname, index) => (
                                <div key={index} className='text-gray-200 px-3 py-0.5 bg-gray-200/15 rounded-full text-xs sm:text-sm'>
                                    {nickname}
                                </div>
                            ))
                        }
                    </div>
                    )
                }

                {/* Bday and Favs */}
                <div className='flex gap-3 text-gray-200 items-center mt-3'>
                    <div className='flex gap-1 items-center'><Calendar width={16} /> <span className='text-xs sm:text-sm mt-0.5'>{bday}</span></div>
                    <div className='flex gap-1 items-center'><Heart className='fill-white ' width={16} /> <span className='text-xs sm:text-sm mt-0.5'>{personInfo.favorites.toLocaleString()} favorites</span></div>
                </div>

                {/* Buttons */}
                <div className='flex gap-3 text-gray-200 items-center mt-3'>
                    <button onClick={() => window.open(personInfo.url, '_blank').focus()} className='cursor-pointer hover:bg-gray-200 flex items-center justify-center text-themeDarkest rounded-lg gap-2 w-30 bg-white text-sm h-8 sm:h-9'><ExternalLink width={16} /><span className='mt-0.5'>MAL Profile</span></button>
                    <button onClick={() => window.open(personInfo.website_url, '_blank').focus()} className={`cursor-pointer ${!personInfo?.website_url && 'hidden'} flex items-center justify-center text-gray-200 rounded-lg gap-2 w-30 border border-gray-500/70 text-sm h-8 sm:h-9 hover:bg-themeDarker cursor-pointerr`}><ExternalLink width={16} /><span className='mt-0.5'>Website</span></button>
                </div>
            </article>
        </div>
    )
}

export default TopSection