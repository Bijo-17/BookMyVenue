

export const buildVenueFormData = (form, photos) => {

    const formData = new FormData();

    formData.append("venueName", form.name);
    formData.append("venueType", form.type);
    formData.append("description", form.description);
    formData.append("address", form.address);
    formData.append("venuePhone", form.phone);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("country", form.country);
    formData.append("pincode", form.pincode);
    formData.append("capacity", form.capacity);
    formData.append("pricePerHour", form.pricePerHour);
    formData.append("pricePerDay", form.pricePerDay);

    formData.append(
        "facilities",
        JSON.stringify(form.facilities)
    );

    formData.append(
        "idealFor",
        JSON.stringify(form.idealFor)
    );

    photos.forEach(photo => {

        formData.append("photos", photo.file);

    });
    
    return formData;
}