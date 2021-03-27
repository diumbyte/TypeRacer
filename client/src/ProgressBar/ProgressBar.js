export default function ProgressBar({percentage, fillerColor}) {
    const containerStyles = {
        // height: 20,
        width: '100%',
        backgroundColor: '#e0e0de',
        borderRadius: 5,
        margin: '.5rem 0',
        border: '2px solid #eee',
        // padding: '.5rem'
    }
    
    const fillerStyles = {
        height: '100%',
        width: `${percentage}%`,
        backgroundColor: `${fillerColor}`,
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width .1s ease-in-out',
        padding: '.75rem 0'
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }
    
    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${percentage}%`}</span>
            </div>
        </div>
    )
}