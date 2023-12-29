export const ModalContainer: React.FC<{children: React.ReactNode}> = ({ children }) => {

    return (
        <section className="
            fixed z-50 top-0 left-0
            flex items-center justify-center
            bg-black bg-opacity-50
            w-screen h-screen
        ">
            {
                children
            }
        </section>
    )
}