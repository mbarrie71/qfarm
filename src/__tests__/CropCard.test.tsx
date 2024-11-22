import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CropCard from '../components/CropCard';
import { BrowserRouter } from 'react-router-dom';

describe('CropCard', () => {
  const mockCrop = {
    id: 1,
    name: 'Test Crop',
    description: 'Test Description',
    price: 100,
    quantity: 10,
    image_url: 'test-image.jpg',
    seller: {
      id: 1,
      name: 'Test Seller'
    }
  };

  it('renders crop information correctly', () => {
    render(
      <BrowserRouter>
        <CropCard crop={mockCrop} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockCrop.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockCrop.price}`)).toBeInTheDocument();
    expect(screen.getByText(`Quantity: ${mockCrop.quantity}`)).toBeInTheDocument();
    expect(screen.getByText(mockCrop.seller.name)).toBeInTheDocument();
  });

  it('renders image with correct src', () => {
    render(
      <BrowserRouter>
        <CropCard crop={mockCrop} />
      </BrowserRouter>
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockCrop.image_url);
    expect(image).toHaveAttribute('alt', mockCrop.name);
  });
});
