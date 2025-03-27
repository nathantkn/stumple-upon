const APIForm = ({onSubmit}) => {
    return (
        <div>
            <form onSubmit={onSubmit}>
                <button type="submit" className="button">
                    🔀 Discover
                </button>
            </form>
        </div>
    );
};

export default APIForm;