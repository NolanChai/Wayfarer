export const PlaceCard = ({ links }) => {
    
    const handleClick = (url) => {
        window.open(url, "_blank");
      };

    const colors = ['bg-paper_yellow', 'bg-paper_brown', 'bg-paper_green']
    
    console.log("This is inside the place card button")
    console.log(links)

    return (
        <div className="flex flex-wrap gap-2 justify-center font-semibold my-4 w-1/2">
            {links.map((link) => (
                <div className={`cursor-pointer rounded ${colors[Math.floor(Math.random() * colors.length)]} p-3`} key={link.name} onClick={() => handleClick(link.url)}>
                    {link.name}
                </div>
            ))}
        </div>
    )
}