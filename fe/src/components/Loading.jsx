import React from 'react'

export const Loading = () => {
    return (
        <div className='flex items-center justify-center gap-2 flex-col'>
            <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-yellow-400"></div>
            <div className='text-2xl'>Loading...</div>
        </div>
    )
}
