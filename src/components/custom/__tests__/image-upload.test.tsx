import ImageUpload from "@/components/custom/image-upload";
import { render } from "@/test/utils";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("ImageUpload Component", () => {
    it("should render file upload area", () => {
        const onChange = vi.fn();
        render(<ImageUpload value="" onChange={onChange} />);

        const uploadText = screen.getByText(/click to upload photo/i);
        expect(uploadText).toBeInTheDocument();
    });

    it("should display uploaded image when value is provided", () => {
        const onChange = vi.fn();
        const imageUrl = "data:image/png;base64,test";

        render(<ImageUpload value={imageUrl} onChange={onChange} />);

        const image = screen.getByAltText("Preview");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", imageUrl);
    });

    it("should clear image when trash button is clicked", () => {
        const onChange = vi.fn();
        const imageUrl = "data:image/png;base64,test";

        render(<ImageUpload value={imageUrl} onChange={onChange} />);

        const clearButton = screen.getByRole("button");
        fireEvent.click(clearButton);

        expect(onChange).toHaveBeenCalledWith("");
    });

    it("should not display clear button when no image is uploaded", () => {
        const onChange = vi.fn();

        render(<ImageUpload value="" onChange={onChange} />);

        const clearButton = screen.queryByRole("button");
        expect(clearButton).not.toBeInTheDocument();
    });
});
